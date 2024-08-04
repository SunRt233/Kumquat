import { useState } from 'react'
import { extendTheme } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { Grid, GridItem } from '@chakra-ui/react'
import { Avatar, AvatarBadge, AvatarGroup, Stack } from '@chakra-ui/react'

/**
 * App组件定义了应用的布局。
 * 
 * 该组件使用Grid和GridItem组件来创建一个具有固定头部、导航、主体和底部的页面布局。
 * 使用CSS Grid布局技术来定义网格的结构和内容的放置。
 */
function App() {
  // 初始化计数器状态
  const [count, setCount] = useState(0)

  // 返回布局组件
  return (
    <>
      <Grid
        // 定义网格的布局区域
        templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
        // 定义网格的行和列大小
        gridTemplateRows={'70px 1fr 30px'}
        gridTemplateColumns={'150px 1fr'}
        // 设置网格占据整个高度
        h='100%'
        // 设置网格项之间的间隔
        gap='1'
        // 设置网格的文本颜色和字体粗细
        color='blackAlpha.700'
        fontWeight='bold'
      >

        <GridItem pl='2' pr='2' bg='orange.300' display='flex' alignItems='center' justifyContent='space-between' area={'header'}>
          <h1>Qumkuat</h1>
          <Stack direction='row'>
            <Avatar name='Oshigaki Kisame' src='https://bit.ly/broken-link' />
          </Stack>
        </GridItem>
        <GridItem pl='2' bg='pink.300' area={'nav'}>
          Nav

        </GridItem>
        <GridItem pl='2' bg='green.300' area={'main'}>
          Main
        </GridItem>
        <GridItem pl='2' bg='blue.300' area={'footer'}>
          Footer
        </GridItem>
      </Grid>
    </> 
  )
}

export default App
