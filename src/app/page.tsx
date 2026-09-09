'use client';

import { useEffect } from 'react';

// 站点为静态导出（output: 'export'），无服务端运行时；
// 因此根路径在浏览器端立即跳转到默认语言 /uk。
export default function RootPage() {
  useEffect(() => {
    window.location.replace('/uk');
  }, []);

  return null;
}
