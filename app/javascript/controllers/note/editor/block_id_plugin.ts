// ripped from 
// https://discuss.prosemirror.net/t/how-i-can-attach-attribute-with-dynamic-value-when-new-paragraph-is-inserted/751/3

import {Plugin} from "prosemirror-state"
import {uuid} from "uuidv4"
import { noteSchema } from "./schema"

export const createBlockIdPlugin = () => {
  return new Plugin({
    appendTransaction: (transactions, _prevState, nextState) => {
      const transaction = nextState.tr

      let modified = false
      if (transactions.some((transaction) => transaction.docChanged)) {
        console.log("block_id_plugin:appendTransaction")

        nextState.doc.descendants((node, pos, _parent) => {
          if (
            node.type == noteSchema.nodes.list_item &&
            !node.attrs["block_id"]
          ) {
            // console.log('setting block_id for:')
            // console.log(node)

            transaction.setNodeMarkup(
              pos,
              undefined,
              {...(node.attrs), ["block_id"]: uuid()}
            )
            modified = true
          }
        })
      }

      return modified ? transaction : null
    }
  })
}
