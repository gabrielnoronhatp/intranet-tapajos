'use client';
import { useParams } from 'next/navigation';
import NegotiationsRegistration from '../../page';

export default function EditNegotiationPage() {
    const params = useParams();
    const id = params.tradeNegotiationsId;
  
    return (
        <NegotiationsRegistration id={id} />
    );
}