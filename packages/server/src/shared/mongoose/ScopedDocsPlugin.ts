import { Schema, Document } from 'mongoose';

/**
 * Plugin di Mongoose che aiuta la gestione dei campi privati
 */
export const ScopedDocsPlugin = <T>() => (schema: Schema) => {
  /** Campi dello schema privati */
  const privateFields = [];

  schema.eachPath((path, type: any) => {
    if (!type.options.scope) return;
    if (typeof type.options.scope !== 'string')
      throw new Error('The "scope" field must be a string');

    switch (type.options.scope) {
      // Se il campo è privato
      case 'private':
        privateFields.push(path);
        break;
      // Pubblico
      case 'public':
        break;
      default:
        throw new Error('The value of the field "scope" does not exist');
    }
  });

  /**
   * Restituisce il documento adattato in base all'ambito
   * @param modelOrDoc
   * @param scope
   */
  function getScopedObject(
    modelOrDoc: T | (T & Document),
    scope: 'public' | 'private',
  ): T {
    const doc =
      // Controlla se il valore passato è un oggetto o un modello
      (modelOrDoc as any).constructor.name === 'model'
        ? (modelOrDoc as Document).toObject()
        : modelOrDoc;

    // Elima i campi privati
    if (scope === 'public') privateFields.forEach(field => delete doc[field]);

    return doc;
  }

  schema.statics.scope = getScopedObject;

  schema.methods.scope = function(
    this: Document & T,
    scope: 'public' | 'private',
  ): T {
    return getScopedObject(this, scope);
  };
};

export interface ScopedDocsModel<T> {
  scope: (scope: 'public' | 'private') => T;
}

export interface ScopedDocsSchema<T> {
  scope: (modelOrDoc: T | (T & Document), scope: 'public' | 'private') => T;
}
