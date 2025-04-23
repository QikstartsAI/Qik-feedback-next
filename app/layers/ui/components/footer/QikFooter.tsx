import React from 'react';
import { Layout, Image } from 'antd';

const { Footer } = Layout;

type FooterProps = {
  logo: string
}

const QikFooter = ({logo}: FooterProps) => {
  <Footer>
    <Image src={logo}/>
  </Footer>
}

export {QikFooter}