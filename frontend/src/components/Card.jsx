export default function Card({ title, children, style, ...props }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        ...style,
      }}
      {...props}
    >
      {title && <h2 style={{ marginBottom: "20px" }}>{title}</h2>}
      {children}
    </div>
  );
}
