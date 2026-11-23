import Blits from '@lightningjs/blits';
import GameBoard from './components/GameBoard.js';
import { createGame, playMove } from './game.js';
import { nextFocus } from './navigation.js';

// PUBLIC_INTERFACE
/** Own the local round and keyboard focus, delegating only display to GameBoard. */
export default Blits.Application({
  components: { GameBoard },
  template: `
    <Element w="1920" h="1080" color="#0b1420">
      <Element x="160" y="105" w="54" h="5" color="#94f5d5" />
      <Text x="160" y="133" size="24" color="#94f5d5" content="THE CLASSICS / 01" />
      <Text x="160" y="195" size="82" color="#f0f5fa" content="Tic Tac Toe" />
      <Text x="164" y="310" size="28" color="#9aafc3" content="Two players. Three in a row." />
      <Element x="164" y="411" w="80" h="3" color="#293748" />
      <Text x="164" y="458" size="23" color="#9aafc3" content="LOCAL TWO-PLAYER" />
      <Text x="164" y="510" size="44" color="#f0f5fa" :content="$message" />
      <Text x="164" y="581" size="24" color="#9aafc3" :content="$detail" />
      <Text x="164" y="855" size="22" color="#9aafc3" content="ARROWS   Move     /     ENTER   Select" />
      <Text x="164" y="899" size="20" color="#6f859b" content="Move below the board to start a new round." />
      <GameBoard x="1110" y="145" :cells="$cells"
        :focusedIndex="$target" :winningLine="$round.winningLine" />
      <Element x="1110" y="767" w="564" h="82"
        :color="$target === 'restart' ? '#94f5d5' : '#293748'">
        <Element x="4" y="4" w="556" h="74" color="#152333">
          <Text x="282" y="19" mount="{x: 0.5}" size="28" color="#f0f5fa"
            content="New round" />
        </Element>
      </Element>
      <Text x="1110" y="889" size="22" color="#9aafc3" content="X starts  /  Take turns on the same keyboard" />
    </Element>
  `,
  // PUBLIC_INTERFACE
  state() {
    /** Initialize independent round and focus state. */
    return { round: createGame(), target: 0 };
  },
  computed: {
    // PUBLIC_INTERFACE
    cells() {
      /** Derive stable display cells from the authoritative round board. */
      return this.round.board.map((mark, id) => ({
        id, mark: mark || '', label: String(id + 1),
        x: (id % 3) * 192, y: Math.floor(id / 3) * 192,
      }));
    },
    // PUBLIC_INTERFACE
    message() {
      /** Describe the current turn or terminal result without guessing a next player. */
      // Blits discovers dependencies during evaluation: read even initially inactive fields.
      const { status, winner, currentPlayer } = this.round;
      if (status === 'won') return `Player ${winner} wins!`;
      if (status === 'draw') return "It's a draw.";
      return `Player ${currentPlayer}'s turn`;
    },
    // PUBLIC_INTERFACE
    detail() {
      /** Supply a concise contextual instruction. */
      return this.round.status === 'playing'
        ? 'Choose an empty square to place your mark.'
        : 'Select New round to play again.';
    },
  },
  methods: {
    // PUBLIC_INTERFACE
    move(direction) {
      /** Apply the shared navigation policy even after a round ends. */
      this.target = nextFocus(this.target, direction);
    },
    // PUBLIC_INTERFACE
    activate() {
      /** Commit a legal move or reset both the round and focus. */
      if (this.target === 'restart') {
        this.round = createGame();
        this.target = 0;
      } else {
        const next = playMove(this.round, this.target);
        if (next !== this.round) this.round = next;
      }
    },
  },
  input: {
    // PUBLIC_INTERFACE
    up() { /** Move focus up. */ this.move('up'); },
    // PUBLIC_INTERFACE
    down() { /** Move focus down. */ this.move('down'); },
    // PUBLIC_INTERFACE
    left() { /** Move focus left. */ this.move('left'); },
    // PUBLIC_INTERFACE
    right() { /** Move focus right. */ this.move('right'); },
    // PUBLIC_INTERFACE
    enter() { /** Activate the selected control. */ this.activate(); },
  },
});
