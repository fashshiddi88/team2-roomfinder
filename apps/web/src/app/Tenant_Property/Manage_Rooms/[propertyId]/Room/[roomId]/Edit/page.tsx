'use client';
import { useParams } from 'next/navigation';
import { withAuthRoles } from '@/middleware/withAuthRoles';
import EditRoomForm from '../EditRoomForm';

function EditRoomPage() {
  const params = useParams();
  const propertyId = Number(params.propertyId);
  const roomId = Number(params.roomId);
  return <EditRoomForm propertyId={propertyId} roomId={roomId} />;
}
export default withAuthRoles(['TENANT'])(EditRoomPage);
