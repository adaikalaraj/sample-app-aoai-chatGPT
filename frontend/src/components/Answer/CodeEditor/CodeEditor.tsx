import { useState, useMemo } from "react";

import styles from "./CodeEditor.module.css";

interface Props {
    code: string;
    language: "svg" | "html";
    onClose: () => void;
}

export const CodeEditor = ({ code, language, onClose }: Props) => {
    const [editedCode, setEditedCode] = useState(code);
    const [copied, setCopied] = useState(false);

    const srcdoc = useMemo(() => {
        if (language === "svg") {
            return `<!DOCTYPE html><html><head><style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100%;background:#fff;}svg{max-width:100%;height:auto;}</style></head><body>${editedCode}</body></html>`;
        }
        return editedCode;
    }, [editedCode, language]);

    const handleCopy = () => {
        navigator.clipboard.writeText(editedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.editorContainer}>
            <div className={styles.editorHeader}>
                <span>Edit ({language.toUpperCase()})</span>
                <div className={styles.headerActions}>
                    <button className={styles.copyButton} onClick={handleCopy}>
                        {copied ? "Copied!" : "Copy"}
                    </button>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close editor">&times;</button>
                </div>
            </div>
            <div className={styles.editorBody}>
                <textarea
                    className={styles.textarea}
                    value={editedCode}
                    onChange={(e) => setEditedCode(e.target.value)}
                    spellCheck={false}
                />
                <iframe
                    className={styles.previewPane}
                    srcDoc={srcdoc}
                    sandbox="allow-scripts"
                    title="Live preview"
                />
            </div>
        </div>
    );
};
