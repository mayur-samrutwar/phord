import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Check, X, Eye } from 'lucide-react';

// Mock data for properties
const mockProperties = [
  { id: 1, name: "Sunset Apartments", location: "Los Angeles, CA", value: 5000000, yield: 5.2, status: "pending" },
  { id: 2, name: "Mountain View Condos", location: "Denver, CO", value: 3500000, yield: 4.8, status: "pending" },
  { id: 3, name: "Riverside Townhouses", location: "Chicago, IL", value: 4200000, yield: 5.5, status: "pending" },
  { id: 4, name: "Ocean Breeze Villas", location: "Miami, FL", value: 6000000, yield: 6.0, status: "pending" },
  { id: 5, name: "Urban Loft Spaces", location: "New York, NY", value: 7500000, yield: 4.5, status: "pending" },
];

export default function AdminPropertyManagement() {
  const [properties, setProperties] = useState(mockProperties);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleApprove = (id) => {
    setProperties(properties.map(prop => 
      prop.id === id ? {...prop, status: 'approved'} : prop
    ));
    setSelectedProperty(null);
  };

  const handleReject = (id) => {
    setProperties(properties.map(prop => 
      prop.id === id ? {...prop, status: 'rejected'} : prop
    ));
    setSelectedProperty(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Property Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Yield</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell>${property.value.toLocaleString()}</TableCell>
                  <TableCell>{property.yield}%</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      property.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      property.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedProperty(property)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700" onClick={() => handleApprove(property.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleReject(property.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProperty?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p><strong>Location:</strong> {selectedProperty?.location}</p>
            <p><strong>Value:</strong> ${selectedProperty?.value.toLocaleString()}</p>
            <p><strong>Yield:</strong> {selectedProperty?.yield}%</p>
            <p><strong>Status:</strong> {selectedProperty?.status.charAt(0).toUpperCase() + selectedProperty?.status.slice(1)}</p>
            {/* Add more property details here */}
          </div>
          <DialogFooter className="sm:justify-start">
            <div className="flex space-x-4">
              <Button className="bg-green-500 hover:bg-green-600" onClick={() => handleApprove(selectedProperty.id)}>
                <Check className="mr-2 h-4 w-4" /> Approve
              </Button>
              <Button className="bg-red-500 hover:bg-red-600" onClick={() => handleReject(selectedProperty.id)}>
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}