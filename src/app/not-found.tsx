import React from "react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
      }}
    >
      <Image src={'/assets/images/logo2.png'} alt="Logo" width={80} height={80} style={{ marginBottom: "2rem" }} />
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>Page Not Found</p>
      <a href="/">
        <span style={{ color: "#0070f3", textDecoration: "underline", cursor: "pointer" }}>
          Go back home
        </span>
      </a>
    </div>
  );
}
