/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {JSX} from '@solidjs/web';
import IconMenu from './IconMenu';

export default function MobileSidebarToggle(props:{toggle:()=>void;shown:boolean}): JSX.Element {
  return (
    <button
      onClick={props.toggle}
      aria-label="Toggle navigation bar"
      aria-expanded={props.shown?'true':'false'}
      class="navbar__toggle clean-btn"
      type="button">
      <IconMenu />
    </button>
  );
}
