import { DayPicker } from "@solid-unstyled/daypicker";

export function ContainerAttributes() {
  return (
    <DayPicker
      id="testId"
      class="testClass"
      data-test="testData"
      nonce="foo_nonce"
      title="foo_title"
      lang="it"
    />
  );
}
