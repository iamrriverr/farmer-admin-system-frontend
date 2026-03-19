import 'highlight.js/styles/github-dark.css';

import hljs from 'highlight.js';
import { marked, type Tokens } from 'marked';

// 配置 marked 擴展
marked.use({
  renderer: {
    // 程式碼區塊渲染
    code(token: Tokens.Code): string {
      const code = token.text;
      const lang = token.lang || '';

      if (lang && hljs.getLanguage(lang)) {
        try {
          const highlighted = hljs.highlight(code, { language: lang }).value;
          return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
        } catch (err) {
          console.error('Highlight error:', err);
        }
      }

      // 自動檢測語言
      const highlighted = hljs.highlightAuto(code).value;
      return `<pre><code class="hljs">${highlighted}</code></pre>`;
    },

    // 行內程式碼渲染
    codespan(token: Tokens.Codespan): string {
      return `<code class="inline-code">${token.text}</code>`;
    },

    // 連結渲染（增加安全性）
    link(token: Tokens.Link): string {
      const href = token.href;
      const title = token.title ? ` title="${token.title}"` : '';
      const text = token.text;
      return `<a href="${href}"${title} target="_blank" rel="noopener noreferrer">${text}</a>`;
    },
  },
  breaks: true, // 支援換行
  gfm: true, // 支援 GitHub Flavored Markdown
});

/**
 * 格式化 Markdown 為 HTML
 */
export const formatMarkdown = (content: string): string => {
  try {
    return marked.parse(content) as string;
  } catch (error) {
    console.error('Markdown parse error:', error);
    return content;
  }
};

/**
 * 格式化日期
 * @param date - 日期物件或字串
 * @param format - 格式類型：'full' | 'short' | 'time'
 */
export const formatDate = (
  date: Date | string,
  format: 'full' | 'short' | 'time' = 'full'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;

  switch (format) {
    case 'full':
      return d.toLocaleString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'short':
      return d.toLocaleDateString('zh-TW', {
        month: 'short',
        day: 'numeric',
      });
    case 'time':
      return d.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
      });
    default:
      return d.toISOString();
  }
};

/**
 * 截斷文字
 * @param text - 原始文字
 * @param maxLength - 最大長度（預設 50）
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * 轉義 HTML 特殊字元
 */
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};
