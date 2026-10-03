import type { Locale } from './i18n/config'

export const categories = ['color', 'typography', 'icons', 'illustration', 'inspiration', 'tooling'] as const
export type Category = (typeof categories)[number]
export const pricings = ['free', 'freemium', 'paid'] as const
export type Pricing = (typeof pricings)[number]

export type Resource = {
  id: string
  name: string
  url: string
  category: Category
  pricing: Pricing
  featured?: boolean
  tags: string[]
  description: Record<Locale, string>
}

export const resources: Resource[] = [
  { id: 'oklch', name: 'OKLCH Picker', url: 'https://oklch.com', category: 'color', pricing: 'free', featured: true, tags: ['oklch', 'picker', 'p3'], description: { en: 'Pick and convert colors in OKLCH with live gamut warnings for sRGB and P3.', zh: '在 OKLCH 中选色与转换，实时提示 sRGB 与 P3 色域溢出。' } },
  { id: 'coolors', name: 'Coolors', url: 'https://coolors.co', category: 'color', pricing: 'freemium', tags: ['palette', 'generator'], description: { en: 'Spacebar-driven palette generator with export to almost every format.', zh: '按空格即可生成配色，几乎支持所有导出格式。' } },
  { id: 'huetone', name: 'Huetone', url: 'https://huetone.ardov.me', category: 'color', pricing: 'free', tags: ['scale', 'contrast', 'apca'], description: { en: 'Build accessible color systems with APCA and WCAG contrast charts.', zh: '基于 APCA 与 WCAG 对比度图表构建无障碍色彩系统。' } },
  { id: 'radix-colors', name: 'Radix Colors', url: 'https://www.radix-ui.com/colors', category: 'color', pricing: 'free', featured: true, tags: ['scale', 'dark mode', 'system'], description: { en: 'A 12-step color system designed for UI, with matching dark mode scales.', zh: '为界面设计的 12 阶色彩系统，并附带对应的深色模式色阶。' } },
  { id: 'contrast', name: 'Who Can Use', url: 'https://www.whocanuse.com', category: 'color', pricing: 'free', tags: ['contrast', 'accessibility', 'wcag'], description: { en: 'See how a color combination reads for people with different vision types.', zh: '查看某组配色在不同视觉类型人群眼中的可读性。' } },
  { id: 'google-fonts', name: 'Google Fonts', url: 'https://fonts.google.com', category: 'typography', pricing: 'free', featured: true, tags: ['fonts', 'variable', 'open source'], description: { en: 'Over 1,600 open-source font families, many with variable axes.', zh: '超过 1600 款开源字体家族，许多支持可变字轴。' } },
  { id: 'fontshare', name: 'Fontshare', url: 'https://www.fontshare.com', category: 'typography', pricing: 'free', tags: ['fonts', 'display'], description: { en: 'Quality display and text faces from the Indian Type Foundry, free for commercial use.', zh: '印度字体铸造厂出品的高质量标题与正文字体，可免费商用。' } },
  { id: 'typescale', name: 'Typescale', url: 'https://typescale.com', category: 'typography', pricing: 'free', tags: ['scale', 'modular'], description: { en: 'Preview modular type scales with your choice of Google Font.', zh: '使用任意 Google 字体预览模块化字号阶梯。' } },
  { id: 'utopia', name: 'Utopia', url: 'https://utopia.fyi', category: 'typography', pricing: 'free', tags: ['fluid', 'clamp', 'responsive'], description: { en: 'Fluid type and space calculators that generate CSS clamp() values.', zh: '流体字号与间距计算器，自动生成 CSS clamp() 值。' } },
  { id: 'wakamai', name: 'Wakamai Fondue', url: 'https://wakamaifondue.com', category: 'typography', pricing: 'free', tags: ['opentype', 'features', 'inspect'], description: { en: 'Drop in a font file to see every OpenType feature and variable axis it supports.', zh: '拖入字体文件，查看其支持的全部 OpenType 特性与可变字轴。' } },
  { id: 'lucide', name: 'Lucide', url: 'https://lucide.dev', category: 'icons', pricing: 'free', featured: true, tags: ['svg', 'react', 'stroke'], description: { en: 'A consistent, community-run icon set with first-class React support.', zh: '风格统一、社区维护的图标库，原生支持 React。' } },
  { id: 'phosphor', name: 'Phosphor Icons', url: 'https://phosphoricons.com', category: 'icons', pricing: 'free', tags: ['svg', 'weights', 'duotone'], description: { en: 'Flexible icon family with six weights, from thin to duotone.', zh: '灵活的图标家族，提供从细线到双色共六种字重。' } },
  { id: 'iconify', name: 'Iconify', url: 'https://iconify.design', category: 'icons', pricing: 'free', tags: ['svg', 'aggregator'], description: { en: 'One API for over 200,000 icons from 150+ open-source sets.', zh: '一个接口即可使用 150 多个开源图标集中的 20 万个图标。' } },
  { id: 'streamline', name: 'Streamline', url: 'https://www.streamlinehq.com', category: 'icons', pricing: 'freemium', tags: ['svg', 'illustration', 'figma'], description: { en: 'Huge icon and illustration library with a Figma plugin.', zh: '海量图标与插画库，并提供 Figma 插件。' } },
  { id: 'opendoodles', name: 'Open Doodles', url: 'https://www.opendoodles.com', category: 'illustration', pricing: 'free', tags: ['hand drawn', 'svg', 'cc0'], description: { en: 'Free, hand-drawn sketchy illustrations released under CC0.', zh: '免费手绘风格插画，采用 CC0 协议发布。' } },
  { id: 'blush', name: 'Blush', url: 'https://blush.design', category: 'illustration', pricing: 'freemium', tags: ['customizable', 'characters'], description: { en: 'Mix-and-match illustrations from artists around the world.', zh: '自由组合来自世界各地艺术家的插画作品。' } },
  { id: 'undraw', name: 'unDraw', url: 'https://undraw.co', category: 'illustration', pricing: 'free', featured: true, tags: ['svg', 'recolor'], description: { en: 'Open-source illustrations you can recolor to match your brand.', zh: '可一键换成品牌色的开源插画。' } },
  { id: 'mobbin', name: 'Mobbin', url: 'https://mobbin.com', category: 'inspiration', pricing: 'freemium', featured: true, tags: ['ui', 'mobile', 'flows'], description: { en: 'Searchable library of real-world mobile and web app screens and flows.', zh: '可检索的真实移动端与网页应用界面及流程库。' } },
  { id: 'godly', name: 'Godly', url: 'https://godly.website', category: 'inspiration', pricing: 'free', tags: ['web', 'landing', 'motion'], description: { en: 'Astronomically good web design inspiration, with video previews.', zh: '精选顶级网页设计灵感，附带视频预览。' } },
  { id: 'fonts-in-use', name: 'Fonts In Use', url: 'https://fontsinuse.com', category: 'inspiration', pricing: 'free', tags: ['typography', 'archive'], description: { en: 'An archive of typography in the wild, indexed by typeface and format.', zh: '真实世界的字体使用案例档案，按字体与形式索引。' } },
  { id: 'figma', name: 'Figma', url: 'https://www.figma.com', category: 'tooling', pricing: 'freemium', featured: true, tags: ['design', 'prototype', 'collaboration'], description: { en: 'Collaborative interface design, prototyping and dev handoff in the browser.', zh: '在浏览器中协作完成界面设计、原型与开发交付。' } },
  { id: 'shadcn', name: 'shadcn/ui', url: 'https://ui.shadcn.com', category: 'tooling', pricing: 'free', tags: ['react', 'components', 'tailwind'], description: { en: 'Beautifully designed components you copy into your app and own.', zh: '设计精美的组件，复制进项目即归你所有。' } },
  { id: 'v0', name: 'v0', url: 'https://v0.app', category: 'tooling', pricing: 'freemium', tags: ['ai', 'react', 'generate'], description: { en: 'Generate and iterate on full-stack web apps by chatting with AI.', zh: '通过与 AI 对话生成并迭代全栈网页应用。' } },
  { id: 'squoosh', name: 'Squoosh', url: 'https://squoosh.app', category: 'tooling', pricing: 'free', tags: ['images', 'compression', 'webp'], description: { en: 'Compress and compare images side by side, entirely in the browser.', zh: '完全在浏览器中压缩图片并左右对比效果。' } },
]
