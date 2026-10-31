/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {JSX} from '@solidjs/web';

import styles from './IconExternalLink.module.css';

// References symbol in docusaurus-theme-classic/src/inlineSvgSprites.ts
// See why: https://github.com/facebook/docusaurus/issues/5865
const svgSprite = '#theme-svg-external-link';

export default function IconExternalLink(): JSX.Element {
  return (
    <svg
      width={13.5}
      height={13.5}
      aria-label="(opens in new tab)"
      class={styles.iconExternalLink}>
      <use href={svgSprite} />
    </svg>
  );
}
