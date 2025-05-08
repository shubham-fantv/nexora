import React from "react";
import Markdown from "markdown-to-jsx";

const RenderMarkdown = ({ markdown }) => {
  return (
    <div>
      {markdown && (
        <Markdown
          options={{
            forceBlock: true,
            overrides: {
              h1: {
                props: {
                  style: {
                    fontSize: "2.25rem", // 36px
                    fontWeight: "bold",
                    margin: "1.5rem 0 1rem",
                  },
                },
              },
              h2: {
                props: {
                  style: {
                    fontSize: "1.875rem", // 30px
                    fontWeight: "bold",
                    margin: "1.25rem 0 0.75rem",
                  },
                },
              },
              h3: {
                props: {
                  style: {
                    fontSize: "1.5rem", // 24px
                    fontWeight: "600",
                    margin: "1rem 0 0.5rem",
                  },
                },
              },
              h4: {
                props: {
                  style: {
                    fontSize: "1.25rem", // 20px
                    fontWeight: "600",
                    margin: "1rem 0 0.5rem",
                  },
                },
              },
              h5: {
                props: {
                  style: {
                    fontSize: "1rem", // 16px
                    fontWeight: "600",
                    margin: "0.75rem 0 0.5rem",
                  },
                },
              },
              h6: {
                props: {
                  style: {
                    fontSize: "0.875rem", // 14px
                    fontWeight: "600",
                    margin: "0.5rem 0 0.25rem",
                  },
                },
              },
              p: {
                props: {
                  style: {
                    fontSize: "1rem", // 16px
                    lineHeight: "1.6",
                    margin: "0.5rem 0",
                    whiteSpace: "pre-line", // Preserves \n line breaks
                  },
                },
              },
              a: {
                props: {
                  style: {
                    color: "#1e90ff",
                    textDecoration: "underline",
                  },
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
              },
              ul: {
                props: {
                  style: {
                    paddingLeft: "1.5rem",
                    marginBottom: "1rem",
                  },
                },
              },
              ol: {
                props: {
                  style: {
                    paddingLeft: "1.5rem",
                    marginBottom: "1rem",
                  },
                },
              },
              li: {
                props: {
                  style: {
                    marginBottom: "0.25rem",
                  },
                },
              },
              blockquote: {
                props: {
                  style: {
                    borderLeft: "4px solid #ccc",
                    paddingLeft: "1rem",
                    color: "#666",
                    fontStyle: "italic",
                    margin: "1rem 0",
                  },
                },
              },
              code: {
                props: {
                  style: {
                    background: "#f5f5f5",
                    padding: "0.2rem 0.4rem",
                    color: "#000",
                    borderRadius: "4px",
                    fontFamily: "monospace",
                    fontSize: "0.95rem",
                  },
                },
              },
              pre: {
                props: {
                  style: {
                    background: "#f5f5f5",
                    padding: "1rem",
                    borderRadius: "6px",
                    overflowX: "auto",
                    fontSize: "0.95rem",
                    fontFamily: "monospace",
                    margin: "1rem 0",
                  },
                },
              },
              hr: {
                props: {
                  style: {
                    border: "none",
                    borderTop: "1px solid #ccc",
                    margin: "2rem 0",
                  },
                },
              },
              strong: {
                props: {
                  style: {
                    fontWeight: "bold",
                  },
                },
              },
              em: {
                props: {
                  style: {
                    fontStyle: "italic",
                  },
                },
              },
            },
          }}
        >
          {markdown}
        </Markdown>
      )}
    </div>
  );
};

export default RenderMarkdown;
