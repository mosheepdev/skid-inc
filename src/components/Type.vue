<template>
  <div id="type" @click="focus()">
    <p class="type-prefix">{{username}}@skid-inc ></p>
    <input v-model="command" type="text" class="type-input"
      v-on:keydown.enter="submitCommand()"
      v-on:keydown.38="browseCommandHistory('up')"
      v-on:keydown.40="browseCommandHistory('down')"
      v-on:keydown.ctrl.75="clearToCaret($event)"
      v-on:keydown.9="autocomplete($event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Type extends Vue {
  public command: string;

  constructor() {
    super();

    this.command = '';
  }

  get username(): string {
    return this.$store.getters.getUsername;
  }

  /** Focus the input when clicking on the `#type` div-container. */
  public focus(): void {
    const input: HTMLInputElement = this.$el.getElementsByTagName('input')[0];

    input.focus();
  }

  /** On-enter: trim and slice the command, commit it to the store */
  public submitCommand(): void {
    const cmd: string[] = this.command.replace(/ +(?= )/g, '').trim().split(' ');

    /* Avoid submit empty commands */
    if (cmd.length > 0 && cmd[0].length > 0) {
      this.$store.dispatch('COMMAND_SUBMIT', cmd);

      this.command = '';
    }
  }

  /** Navigate through the command history: `up` or `down` */
  public browseCommandHistory(direction: 'up' | 'down'): void {
    this.$store.commit('browseCommandHistory', direction);

    this.command = this.$store.getters.getCommandHistory;
  }

  /** Clear the command from the end to the caret position */
  public clearToCaret(event: KeyboardEvent): void {
    if (event === null || event.target === null) {
      return;
    }

    // @ts-ignore - event.target is not an HTMLInputElement
    const caretPosition: number = event.target.selectionStart;

    this.command = this.command.substr(0, caretPosition);
  }

  /** Autocomplete the current command when pressing `tab` */
  public autocomplete(event: KeyboardEvent): void {
    const cmd: string[] = this.command.replace(/ +(?= )/g, '').trim().split(' ');
    const cursorPos = (event.target as HTMLInputElement).selectionStart;

    event.preventDefault();
    this.$store.dispatch('COMMAND_AUTOCOMPLETE', { cmd, cursorPos });

    this.command = this.$store.getters.getAutocompletedCommand;
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

#type {
  display: flex;
  padding: 16px;
  cursor: pointer;

  .type-prefix {
    padding: 0;
    margin: 0 8px 0 0;
    font-size: 1.25rem;
  }

  .type-input {
    flex: 1 1 auto;
    padding: 0;
    margin: 0;
    border: 0;
    font-size: 1.25rem;
    color: inherit;
    background-color: transparent;
    cursor: pointer;

    &:focus {
      outline: 0;
    }
  }
}
</style>
