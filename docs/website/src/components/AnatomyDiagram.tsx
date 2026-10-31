import v9Style from '@solid-unstyled/daypicker/style.css?raw';
import type { JSX } from '@solidjs/web';
import styles from "./AnatomyDiagram.module.css";
import { ShadowDomWrapper } from "./ShadowDomWrapper";
import { createSignal, createEffect } from "solid-js";

const diagramWidth = 780;
const diagramHeight = 590;

export function AnatomyDiagram(componentProps: { children: JSX.Element }) {
  const viewportRef = { current: null as HTMLDivElement | null };
  const [scale, setScale] = createSignal(1);
  const baseStyleCss = v9Style;

  createEffect(() => [], () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateScale = () => {
      setScale(Math.min(1, viewport.clientWidth / diagramWidth));
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  });

  return (
    <div class={styles.viewport} ref={node => { viewportRef.current = node; }}>
      <div
        class={styles.frame}
        style={{ height: `${diagramHeight * scale()}px` }}
      >
        <figure
          aria-label="Annotated DayPicker anatomy diagram"
          class={styles.diagram}
          data-anatomy-diagram
          style={{ transform: `scale(${scale()})` }}
        >
          <div class={styles.calendar}>
            <ShadowDomWrapper baseStyleCss={baseStyleCss} styleStr={undefined}>
              {componentProps.children}
            </ShadowDomWrapper>
          </div>

          <svg
            aria-hidden="true"
            class={styles.lines}
            fill="none"
            viewBox="0 0 780 650"
          >
            <title>Annotation connector lines</title>
            <path d="M 300 110 L 326 190" />
            <path d="M 540 100 L 540 190" />
            <path d="M 642 126 L 558 190" />
            <path d="M 642 126 L 596 190" />
            <path d="M 208 248 L 260 248" />
            <path d="M 426 154 L 382 246" />
            <path d="M 426 154 L 536 246" />
            <path d="M 208 200 L 282 248" />
            <path d="M 642 286 L 502 326" />
            <path d="M 642 326 L 590 326" />
            <path d="M 642 378 L 590 378" />
            <path d="M 208 326 L 260 326" />
            <path d="M 208 474 L 260 427" />
            <path d="M 208 474 L 260 471" />
            <path d="M 370 602 L 370 427" />
            <path d="M 440 574 L 440 427" />
            <path d="M 502 602 L 502 427" />
            <path d="M 642 486 L 546 471" />
            <path d="M 642 600 L 590 515" />
            <path d="M 196 546 L 246 546" />
          </svg>

          <span
            class={`${styles.callout} ${styles.centerCallout} ${styles.monthCaption}`}
          >
            Month Caption
          </span>
          <span
            class={`${styles.callout} ${styles.centerCallout} ${styles.navigationBar}`}
          >
            Navigation Bar
          </span>
          <span
            class={`${styles.callout} ${styles.centerCallout} ${styles.navigationButtons}`}
          >
            Navigation Buttons
          </span>
          <span
            class={`${styles.callout} ${styles.leftCallout} ${styles.weekdaysRow}`}
          >
            Weekdays Row
          </span>
          <span
            class={`${styles.callout} ${styles.centerCallout} ${styles.weekdays}`}
          >
            Weekdays
          </span>
          <span
            class={`${styles.callout} ${styles.leftCallout} ${styles.weekNumberHeader}`}
          >
            Week Number Header
          </span>
          <span
            class={`${styles.callout} ${styles.leftCallout} ${styles.weekRows}`}
          >
            Week Rows
          </span>
          <span
            class={`${styles.callout} ${styles.leftCallout} ${styles.weekNumbers}`}
          >
            Week Numbers
          </span>
          <span class={`${styles.callout} ${styles.dayButton}`}>
            Day / DayButton
          </span>
          <span class={`${styles.callout} ${styles.today}`}>
            Today&apos;s Date
          </span>
          <span class={`${styles.callout} ${styles.disabledDay}`}>
            Disabled Day
          </span>
          <span
            class={`${styles.callout} ${styles.centerCallout} ${styles.rangeStart}`}
          >
            Range Start
          </span>
          <span
            class={`${styles.callout} ${styles.centerCallout} ${styles.rangeMiddle}`}
          >
            Range Middle
          </span>
          <span
            class={`${styles.callout} ${styles.centerCallout} ${styles.rangeEnd}`}
          >
            Range End
          </span>
          <span class={`${styles.callout} ${styles.selectedDay}`}>
            Selected Day
          </span>
          <span class={`${styles.callout} ${styles.outsideDays}`}>
            Outside Days
          </span>
          <span
            class={`${styles.callout} ${styles.leftCallout} ${styles.footer}`}
          >
            Footer
          </span>
        </figure>
      </div>
    </div>
  );
}
