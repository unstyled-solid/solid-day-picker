/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {JSX} from '@solidjs/web';

export default function NavbarContent(props: {
  left: JSX.Element;
  right: JSX.Element;
}) {
  return (
    <div class="navbar__inner">
      <div
        class="theme-layout-navbar-left navbar__items">
        {props.left}
      </div>
      <div
        class="theme-layout-navbar-right navbar__items navbar__items--right">
        {props.right}
      </div>
    </div>
  );
}
