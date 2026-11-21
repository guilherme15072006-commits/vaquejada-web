'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function Index() { const r = useRouter(); useEffect(() => { r.replace('/splash'); }, [r]); return null; }
