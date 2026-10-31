/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {JSX} from '@solidjs/web';
import styles from './Admonition.module.css';
import Note from './AdmonitionIcons/Note';
import Info from './AdmonitionIcons/Info';
import Tip from './AdmonitionIcons/Tip';
import Warning from './AdmonitionIcons/Warning';
import Danger from './AdmonitionIcons/Danger';

type Props={type:'note'|'info'|'tip'|'warning'|'caution'|'danger';title?:string;children?:JSX.Element;class?:string;id?:string;icon?:JSX.Element};
const icons={note:Note,info:Info,tip:Tip,warning:Warning,caution:Warning,danger:Danger};
const colors={note:'secondary',info:'info',tip:'success',warning:'danger',caution:'warning',danger:'danger'};

function AdmonitionContainer(props: Props) {
  return (
    <div
      class={`theme-admonition theme-admonition-${props.type} ${styles.admonition} alert alert--${colors[props.type]} ${props.class??''}`}
      id={props.id}>
      {props.children}
    </div>
  );
}

function AdmonitionHeading(props: Pick<Props, 'icon' | 'title'>) {
  return (
    <div class={styles.admonitionHeading}>
      <span class={styles.admonitionIcon}>{props.icon}</span>
      {props.title}
    </div>
  );
}

function AdmonitionContent(props: Pick<Props, 'children'>) {
  return <div class={styles.admonitionContent}>{props.children}</div>;
}

export default function AdmonitionLayout(props: Props): JSX.Element {
  const Icon=icons[props.type];
  return (
    <AdmonitionContainer type={props.type} class={props.class} id={props.id}>
      <AdmonitionHeading title={props.title??props.type} icon={props.icon??<Icon/>}/>
      <AdmonitionContent>{props.children}</AdmonitionContent>
    </AdmonitionContainer>
  );
}
