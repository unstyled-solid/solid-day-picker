/** Copyright (c) Facebook, Inc. and its affiliates. Licensed under MIT. */
import type { JSX } from '@solidjs/web';
import styles from "./BrowserWindow.module.css";
import { ShadowDomWrapper } from "./ShadowDomWrapper";

interface Props {
  children: JSX.Element;
  baseStyleCss?: string;
  minHeight?: number;
  url?: string;
  style?: JSX.CSSProperties;
  styleStr?: string;
  bodyStyle?: JSX.CSSProperties;
  shadow?: boolean;
  sourceUrl?: string;
  sourceLabel?: string;
}

export function BrowserWindow(componentProps: Props) {
  return (
    <div class={styles.browserWindow} style={{ ...componentProps.style, "min-height": componentProps.minHeight===undefined?undefined:`${componentProps.minHeight}px` }}>
      <div class={styles.browserWindowHeader}>
        <div class={styles.buttons}>
          <span class={styles.dot} style={{ background: "#f25f58" }} />
          <span class={styles.dot} style={{ background: "#fbbe3c" }} />
          <span class={styles.dot} style={{ background: "#58cb42" }} />
        </div>
        {componentProps.url ? (
          <div class={styles.browserWindowAddressBar}>{componentProps.url}</div>
        ) : null}
        {componentProps.sourceUrl ? (
          <a
            class={styles.sourceLink}
            href={componentProps.sourceUrl}
            rel="noreferrer"
            target="_blank"
          >
            {(componentProps.sourceLabel === undefined ? "View source" : componentProps.sourceLabel)}
          </a>
        ) : null}
      </div>

      <div class={`${styles.browserWindowBody} rdp-demo`} style={componentProps.bodyStyle}>
        {(componentProps.shadow === undefined ? true : componentProps.shadow) ? (
          <ShadowDomWrapper baseStyleCss={componentProps.baseStyleCss} styleStr={componentProps.styleStr}>
            {componentProps.children}
          </ShadowDomWrapper>
        ) : (
          componentProps.children
        )}
      </div>
    </div>
  );
}
