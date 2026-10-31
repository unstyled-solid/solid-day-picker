import { DayPicker } from "@solid-unstyled/daypicker";

export function AnimateCSSVars() {
  return (
    <>
      <style>
        {`
        .custom-animate {
          --rdp-animation_duration: .1s;
          --rdp-animation_timing: ease-in;
          }
        `}
      </style>
      <DayPicker class="custom-animate" animate />
    </>
  );
}
