'use client';
import { useParams } from 'next/navigation';
import NegotiationsRegistration from '../../page';

export default function EditNegotiationPage() {
    const params = useParams();
    const id = params
    
   
  
    return (
        <>
            <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px' }}>
                
                <NegotiationsRegistration id={id} />
            </div>
           
        </>
    );
} 