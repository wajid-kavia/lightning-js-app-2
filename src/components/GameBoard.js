import Blits from '@lightningjs/blits';

// PUBLIC_INTERFACE
/** Render the nine cells supplied by App without owning game or input state. */
export default Blits.Component('GameBoard', {
  props: ['cells', 'focusedIndex', 'winningLine'],
  template: `
    <Element w="576" h="576">
      <Element :for="cell in $cells" :key="$cell.id"
        :x="$cell.x" :y="$cell.y" w="180" h="180"
        :color="$focusedIndex === $cell.id ? '#94f5d5' : '#293748'">
        <Element x="4" y="4" w="172" h="172"
          :color="$winningLine.includes($cell.id) ? '#224f49' : '#152333'">
          <Text x="86" y="26" mount="{x: 0.5}"
            size="102" :color="$cell.mark === 'X' ? '#94f5d5' : '#f6bc83'"
            :content="$cell.mark" />
          <Text x="12" y="139" size="18" color="#8093a8" :content="$cell.label" />
        </Element>
      </Element>
    </Element>
  `,
});
