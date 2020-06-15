import { Controller } from 'stimulus'

import 'trix'

class Note {
  constructor(
    private id: string
  ){}

  async updateTitle(newTitle: String) {
    let path = `/notes/${this.id}`

    let response = await fetch(path, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')['content'],
      },
      body: JSON.stringify({
        note: {
          title: newTitle
        }
      })
    })

    return response.ok
  }
}

export default class extends Controller {
  static targets = ['editor', 'loader']

  // https://github.com/stimulusjs/stimulus/search?q=targets+typescript&type=Issues
  editorTarget: Element
  loaderTarget: Element

  private note: Note
  private loadingStack = 0

  connect() {
    console.log('stimulus: note connected on:')
    console.log(this.element)

    this.note = new Note(
      this.data.get('id')
    )
  }

  async updateTitle(event: Event) {
    let input = <HTMLInputElement>event.target
    let newTitle = input.value

    this.increaseLoadingStack()

    let responseOk = await this.note.updateTitle(newTitle)
    // TODO handle conflict

    this.decreaseLoadingStack()
  }

  async updateContent(event: Event) {
    console.log(event)
  }

  private increaseLoadingStack() {
    this.loadingStack += 1
    this.refreshLoader()
  }

  private decreaseLoadingStack() {
    this.loadingStack -= 1
    this.refreshLoader()
  }

  private refreshLoader() {
    this.loaderTarget.innerHTML = `${this.loadingStack}`
  }
}