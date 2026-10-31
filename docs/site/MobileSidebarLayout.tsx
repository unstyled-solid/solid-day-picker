/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {JSX} from '@solidjs/web';

function NavbarMobileSidebarPanel(props: {
  children?: JSX.Element;
  inert: boolean;
}) {
  return (
    <div
      class="theme-layout-navbar-sidebar-panel navbar-sidebar__item menu"
      inert={props.inert}>
      {props.children}
    </div>
  );
}

export default function NavbarMobileSidebarLayout(props: {
  header: JSX.Element;
  primaryMenu: JSX.Element;
  secondaryMenu: JSX.Element;
  secondaryMenuShown: boolean;
  shown:boolean;
}): JSX.Element {
  return (
    <div
      class="theme-layout-navbar-sidebar navbar-sidebar" inert={!props.shown}>
      {props.header}
      <div
        class={`navbar-sidebar__items ${props.secondaryMenuShown?'navbar-sidebar__items--show-secondary':''}`}>
        <NavbarMobileSidebarPanel inert={props.secondaryMenuShown}>
          {props.primaryMenu}
        </NavbarMobileSidebarPanel>
        <NavbarMobileSidebarPanel inert={!props.secondaryMenuShown}>
          {props.secondaryMenu}
        </NavbarMobileSidebarPanel>
      </div>
    </div>
  );
}
