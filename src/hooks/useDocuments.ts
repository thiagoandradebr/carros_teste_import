import { useContext } from 'react';
import { ServicesContext } from '@/contexts/ServicesContext';
import { ServiceDocument } from '@/types/service';

export function useDocuments() {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useDocuments must be used within a ServicesProvider');
  }

  const { services, updateService } = context;

  const addDocument = (serviceId: string, document: Omit<ServiceDocument, 'id' | 'serviceId'>) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const newDocument: ServiceDocument = {
      id: `doc_${Date.now()}`,
      serviceId,
      ...document,
      uploadedAt: new Date().toISOString(),
    };

    updateService({
      ...service,
      documents: [...service.documents, newDocument],
    });

    return newDocument;
  };

  const removeDocument = (serviceId: string, documentId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    updateService({
      ...service,
      documents: service.documents.filter(doc => doc.id !== documentId),
    });
  };

  const updateDocument = (
    serviceId: string,
    documentId: string,
    updates: Partial<Omit<ServiceDocument, 'id' | 'serviceId'>>
  ) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const documentIndex = service.documents.findIndex(doc => doc.id === documentId);
    if (documentIndex === -1) return;

    const updatedDocuments = [...service.documents];
    updatedDocuments[documentIndex] = {
      ...updatedDocuments[documentIndex],
      ...updates,
    };

    updateService({
      ...service,
      documents: updatedDocuments,
    });

    return updatedDocuments[documentIndex];
  };

  const getDocuments = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.documents || [];
  };

  const getDocumentsByType = (serviceId: string, type: ServiceDocument['type']) => {
    const service = services.find(s => s.id === serviceId);
    return service?.documents.filter(doc => doc.type === type) || [];
  };

  return {
    addDocument,
    removeDocument,
    updateDocument,
    getDocuments,
    getDocumentsByType,
  };
}
