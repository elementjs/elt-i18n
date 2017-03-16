
import {o, Display, Observable, TransformObservable, MaybeObservable} from 'domic'

export const LANG: Observable<string> = o(navigator.language.slice(0, 2))

export type TradFn<T> = (ctx: T) => string|Node

/**
 * Extend it with the languages you wish to support.
 */
export interface Languages<T> {
  [code: string]: T
}


export function P(n: number, plural: string, singular: string) {
  if (n > 1)
    return plural
  return singular
}

export function S(n: number) { return P(n, 's', '')}

export function L(l: Languages<string>): I18nObservable
export function L<T>(l: Languages<TradFn<T>>): I18nObject<T>
export function L(l: Languages<any>): any {
  for (var x in l) {
    if (typeof (l as any)[x] === 'string') {
      var res = new I18nObservable()
      res.trads = l as any // I know what I'm doing !!
      return res
    } else {
      var res2 = new I18nObject<any>()
      res2.trads = l as any // here too.
      return res2
    }
  }
}


export class I18nObservable extends TransformObservable<string, string> {
  public trads: {[code: string]: string} = {}

  constructor() {
    super(LANG, function (this: I18nObservable, lang: string) {
      if (!this.trads || !this.trads[lang]) return ''
      return this.trads[lang]
    }, undefined)
  }
}


/**
 *
 */
export class I18nObject<T> {
  trads: {[code: string]: TradFn<T>} = {}

  /**
   * Use into the dom.
   * @param ctx
   */
  use(arg: MaybeObservable<T>): Node {
    return Display(o.merge({lang: LANG, arg: arg}).tf(val => {
      var res = (this.trads[val.lang] as any)(val.arg)
      if (typeof res === 'string')
        return document.createTextNode(res)
      return res
    }))
  }
}
