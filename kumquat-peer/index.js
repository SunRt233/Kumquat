const express = require('express');
const expressWs = require('express-ws');
const pty = require('node-pty');
const path = require('path')

const app = express()
expressWs(app)

app.use('/',express.static(path.join(__dirname,'../kumquat-panel/dist')))
app.ws('/', (ws, req) => {
    try {
        console.log(`connected ${req}`)

        const pseudo = pty.spawn('/bin/bash', [], {
            name: 'xterm-color',
            cols: 80,
            rows: 24,
            cwd: process.env.HOME,
            env: process.env,
            handleFlowControl: true
        })

        pseudo.onData((data) => {
            pseudo.write('\x13')
            ws.send(data, (err) => {
                if (err) {
                    
                } else {
                    console.log(`send ok ${data}`)
                    pseudo.write('\x11')
                }
            })
        })


        ws.on('message', (msg) => {
            let data = JSON.parse(msg)
            console.log(data);
            switch (data['typ']) {
                case 'nor':
                    pseudo.write(data['dat'],)
                    break;

                case 'rsz':
                    console.log(data['dat'])
                    pseudo.resize(data['dat']['cols'], data['dat']['rows'])
                    break;
                default:
                    console(`unsupported msg type "${data['data']}"`)
                    break;
            }

        });
        ws.on('close', () => {
            console.log('close')
            pseudo.kill()
        })
        ws.on('error', () => {
            console.error('error ocurred')
        })
    } catch (err) {
        console.error(err)
    }
})

app.listen(3300, "0.0.0.0", () => console.log('ok')).addListener("listening", () => {
    console.log("listening")
})
