import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropertyDetails from '@/components/properties/PropertyDetails'

export default function PropertyPage() {
  const router = useRouter();
  const { id } = router.query;

  return <PropertyDetails propertyId={id} />;
}