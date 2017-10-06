
import {o, Observable, MaybeObservable, VirtualObservable} from 'elt'

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

export function L(l: Languages<Node>): VirtualObservable<Node>
export function L(l: Languages<string>): VirtualObservable<string>
export function L(l: Languages<string|Node>): VirtualObservable<string|Node>
export function L<T>(l: Languages<TradFn<T>>): I18nObject<T>
export function L(l: Languages<any>): any {
  for (var x in l) {
    var prop = l[x]
    if (typeof prop === 'string' || prop instanceof Node) {
      return LANG.tf(lang => l[lang])
    } else {
      var res2 = new I18nObject<any>()
      res2.trads = l as any // here too.
      return res2
    }
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
  use(arg: MaybeObservable<T>): Observable<string|Node> {
    return o.merge({lang: LANG, arg: arg}).tf(val => {
      var res = (this.trads[val.lang] as any)(val.arg)
      return res
    })
  }
}
