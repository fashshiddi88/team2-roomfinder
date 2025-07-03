import EditRoomForm from '../EditRoomForm';

export default function EditRoomPage({
  params,
}: {
  params: { propertyId: string; roomId: string };
}) {
  return (
    <EditRoomForm
      propertyId={Number(params.propertyId)}
      roomId={Number(params.roomId)}
    />
  );
}
