/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {JSX} from '@solidjs/web';

export default function IconMenu(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  return (
    <svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      aria-hidden="true"
      {...props}>
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-miterlimit="10"
        stroke-width="2"
        d="M4 7h22M4 15h22M4 23h22"
      />
    </svg>
  );
}
