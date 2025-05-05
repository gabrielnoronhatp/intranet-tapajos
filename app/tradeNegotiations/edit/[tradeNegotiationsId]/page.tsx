'use client';
import { useParams } from 'next/navigation';
import NegotiationsRegistration from '../../page';

export default function EditNegotiationPage() {
    const params = useParams();
    const id = Number(params.id);
  
    return (
        <NegotiationsRegistration id={id} />
    );
}