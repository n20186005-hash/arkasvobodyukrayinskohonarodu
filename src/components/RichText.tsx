/**
 * 轻量富文本：将消息文案中的 **加粗** 标记渲染为 <strong>，
 * 用于正文语义绑定（景点全称 / 常用名加粗强调）。
 */
export default function RichText({ text }: { text: string }) {
  const parts = String(text ?? '').split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
