import React, { useState, useRef } from "react";
import { Copy20Regular, Checkmark20Regular } from "@fluentui/react-icons";
import styles from "./QuoteBlock.module.css";

export const QuoteBlock = ({node, children, ...props}: {node: any, children?: React.ReactNode, [key: string]: any}) => {
    const [copied, setCopied] = useState(false);
    const blockquoteRef = useRef<HTMLQuoteElement>(null);

    const handleCopy = () => {
        const text = blockquoteRef.current?.innerText ?? '';
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.quoteBlockWrapper}>
            <div className={styles.quoteBlockActions}>
                <button className={styles.quoteBlockCopyButton} onClick={handleCopy} aria-label="Copy quote" title={copied ? "Copied!" : "Copy quote"}>
                    {copied ? <Checkmark20Regular /> : <Copy20Regular />}
                </button>
            </div>
            <blockquote ref={blockquoteRef} className={styles.quoteBlock} {...props}>
                {children}
            </blockquote>
        </div>
    );
};

const InlineQuoteCopyable = ({ text, nestedContent }: { text: string, nestedContent?: React.ReactNode }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <span className={styles.inlineQuoteWrapper}>
            <span className={styles.inlineQuote}>{nestedContent ?? text}</span>
            <button
                className={styles.inlineQuoteCopyButton}
                onClick={handleCopy}
                aria-label="Copy quoted text"
                title={copied ? "Copied!" : "Copy"}
            >
                {copied ? <Checkmark20Regular /> : <Copy20Regular />}
            </button>
        </span>
    );
};

type QuoteType = 'double' | 'single';

const processStringForQuotes = (text: string, skipType?: QuoteType): React.ReactNode[] => {
    const doubleQuotePattern = '[""\u201C\u201D]([^""\u201C\u201D]{2,}?)[""\u201C\u201D]';
    const singleQuotePattern = "[''\\u2018\\u2019]([^''\\u2018\\u2019]{2,}?)[''\\u2018\\u2019]";

    let regexStr: string;
    if (skipType === 'double') {
        regexStr = singleQuotePattern;
    } else if (skipType === 'single') {
        regexStr = doubleQuotePattern;
    } else {
        regexStr = `${doubleQuotePattern}|${singleQuotePattern}`;
    }

    const quoteRegex = new RegExp(regexStr, 'g');
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = quoteRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        // Determine which quote type matched
        const isDouble = skipType !== 'double' && match[1] !== undefined;
        const quotedText = isDouble ? match[1] : (skipType === 'double' ? match[1] : match[2]);
        const quoteChar = match[0][0];
        const endQuoteChar = match[0][match[0].length - 1];
        const currentType: QuoteType = isDouble ? 'double' : 'single';

        // Process inner text for nested quotes of the other type
        const innerProcessed = processStringForQuotes(quotedText, currentType);
        const hasNested = innerProcessed.length > 1 || (innerProcessed.length === 1 && typeof innerProcessed[0] !== 'string');

        parts.push(
            <React.Fragment key={match.index}>
                {quoteChar}
                <InlineQuoteCopyable
                    text={quotedText}
                    nestedContent={hasNested ? <>{innerProcessed}</> : undefined}
                />
                {endQuoteChar}
            </React.Fragment>
        );
        lastIndex = match.index + match[0].length;
    }

    if (parts.length === 0) {
        return [text];
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
};

const processChildren = (children: React.ReactNode): React.ReactNode => {
    if (typeof children === 'string') {
        const processed = processStringForQuotes(children);
        return processed.length === 1 && typeof processed[0] === 'string' ? children : <>{processed}</>;
    }
    if (Array.isArray(children)) {
        return children.map((child, i) => <React.Fragment key={i}>{processChildren(child)}</React.Fragment>);
    }
    // Recurse into React elements (e.g. <strong>, <em>, <a>, <td>, etc.)
    if (React.isValidElement(children)) {
        const element = children as React.ReactElement<any>;
        if (element.props && element.props.children) {
            return React.cloneElement(element, {}, processChildren(element.props.children));
        }
    }
    return children;
};

export const TextWithQuotes = ({node, children, ...props}: {node?: any, children?: React.ReactNode, [key: string]: any}) => {
    return <p {...props}>{processChildren(children)}</p>;
};

export const ListItemWithQuotes = ({node, children, ...props}: {node?: any, children?: React.ReactNode, [key: string]: any}) => {
    return <li {...props}>{processChildren(children)}</li>;
};
