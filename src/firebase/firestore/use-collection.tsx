'use client'

import { useEffect, useState } from 'react';
import { onSnapshot, query, collection, type QueryConstraint } from 'firebase/firestore';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '../errors';
import { convertTimestamps } from '@/lib/utils';

interface UseCollectionOptions {
  constraints?: QueryConstraint[];
}

export function useCollection<T>(
  path: string,
  options?: UseCollectionOptions
) {
  const db = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const constraints = options?.constraints || [];

  useEffect(() => {
    const collectionRef = collection(db, path);
    const q = query(collectionRef, ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          const docData = { id: doc.id, ...doc.data() };
          result.push(convertTimestamps(docData) as T);
        });
        setData(result);
        setLoading(false);
      },
      async (err) => {
        const permissionError = new FirestorePermissionError({
          path: (q as any).path, // Internal property, use with caution
          operation: 'list',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, path, JSON.stringify(constraints)]);

  return { data, loading, error };
}
