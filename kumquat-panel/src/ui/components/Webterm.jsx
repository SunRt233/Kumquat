import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { CanvasAddon } from '@xterm/addon-canvas'
import { WebglAddon } from '@xterm/addon-webgl'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css' //大坑，css需要单独引入
import { useEffect, useRef, useState } from 'react';
import './Webterm.css'

function Webterm(props) {
    const webtermRef = useRef()
    const hasInited = useRef(false)
    const term = new Terminal({
        allowProposedApi: true,
        //   是否禁用输入
        disableStdin: false,
        cursorStyle: 'block',
        //   启用时光标将设置为下一行的开头
        altClickMovesCursor: true,
        convertEol: true,
        // 终端中的回滚量
        scrollback: 10,
        fontSize: 16,
        rows: 20,
        fontFamily: 'Droid Sans Mono, Cascadia Mono, DejaVu Sans Mono',
        // 光标闪烁
        cursorBlink: true, 
        theme: {
            //   字体
            foreground: '#eeeeec',
            background: '#111416',
            selection: '#eeeeec',
            cursor: '#bbbbbb',
            black: '#000000',
            red: '#cd0000',
            green: '#00cd00',
            yellow: '#cdcd00',
            blue: '#1093f5',
            magenta: '#cd00cd', // 注意：`magenta` 替换了 `purple`
            cyan: '#00cdcd',
            white: '#faebd7',
            brightBlack: '#404040',
            brightRed: '#ff0000',
            brightGreen: '#00ff00',
            brightYellow: '#ffff00',
            brightBlue: '#11b5f6',
            brightMagenta: '#ff00ff', // 注意：`brightMagenta` 替换了 `brightPurple`
            brightCyan: '#00ffff',
            brightWhite: '#ffffff',
            // 光标
            // cursor: 'help',
            // lineHeight: 18,
        }
    })
    const fitAddon = new FitAddon();
   
    useEffect(() => {
        if (!webtermRef.current || hasInited.current) return

        const ws = new WebSocket(prompt('请输入ws地址',`ws://${window.location.hostname}:3300`))
        ws.onopen = (ev) => {
            console.log('open');
            fitAddon.fit()
            ws.send(JSON.stringify({ typ: 'rsz', dat: { rows: term.rows, cols: term.cols } }))
            // term.write('\x1b[?1003h'); // 启用鼠标报告
            // term.write('\x1b[?1006h'); // 启用 SGR 鼠标模式
        }
        
        term.loadAddon(fitAddon)
        term.loadAddon(new CanvasAddon())
        term.loadAddon(new WebLinksAddon())
        term.open(webtermRef.current)

        Array.from(term.element.getElementsByClassName('xterm-viewport')).forEach(e => {
            e.style.overflow = 'hidden'
        })

        fitAddon.fit()

        window.onresize = () => {
            fitAddon.fit()
            ws.send(JSON.stringify({ typ: 'rsz', dat: { rows:term.rows, cols:term.cols } }))
        }

        term.onBinary(data => {
            console.log(`onBinary ${data}`)
            ws.send(JSON.stringify({ typ: 'nor', dat: data }))
        })

        term.onData(data => {
            console.log(`onData ${data}`)
            ws.send(JSON.stringify({ typ: 'nor', dat: data }))
        })

        ws.onmessage = (ev) => {
            console.log(`onMsg ${ev.data}`)
            term.write(ev.data)
        }


        hasInited.current = true

    },[])

    return <div style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: term.options.theme.background,
    }}>
        <div ref={webtermRef} style={{
            width: "100%",
            height: "100%",
            overflow: "hidden"
        }}></div>
    </div>
}

export default Webterm