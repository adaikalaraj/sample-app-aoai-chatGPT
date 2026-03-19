import { useMemo } from "react";

import styles from "./CodePreview.module.css";

interface Props {
    code: string;
    language: "svg" | "html";
    onClose: () => void;
}

export const CodePreview = ({ code, language, onClose }: Props) => {
    const srcdoc = useMemo(() => {
        if (language === "svg") {
            return `<!DOCTYPE html><html><head><style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100%;background:#fff;}svg{max-width:100%;height:auto;}</style></head><body>${code}</body></html>`;
        }
        return code;
    }, [code, language]);

    return (
        <div className={styles.previewContainer}>
            <div className={styles.previewHeader}>
                <span>Preview ({language.toUpperCase()})</span>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close preview">&times;</button>
            </div>
            <iframe
                className={styles.previewIframe}
                srcDoc={srcdoc}
                sandbox="allow-scripts"
                title="Code preview"
            />
        </div>
    );
};
