


export default function contentToMarkdown(html:string) {
    // 转义HTML标签（防止XSS）
  html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // 处理代码块（```）
  html = html.replace(/```(\w+)?\n([\s\S]*?)\n```/g, (_, lang, code) => {
    return `<pre class="code-block"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
  })

  // 处理行内代码（`）
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

  // 处理粗体（**）
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // 处理斜体（*）
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // 处理标题
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>')

  // 处理链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  // 处理无序列表
  html = html.replace(/^- (.*)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

  // 处理有序列表
  html = html.replace(/^\d+\. (.*)$/gm, '<li>$1</li>')

  // 处理引用
  html = html.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>')

  // 处理分割线
  html = html.replace(/^---$/gm, '<hr>')

  // 处理换行
  html = html.replace(/\n/g, '<br>')

  // 清理多余的br标签
  html = html.replace(/<br><br>/g, '<br>')

  return html
}