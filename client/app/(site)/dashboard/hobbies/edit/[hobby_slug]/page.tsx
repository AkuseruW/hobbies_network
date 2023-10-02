import HobbyFormUpdate from "@/components/dashboard/form/hobbies/patch";
import { getHobbyBySlug } from "@/utils/requests/_hobbies_requests";

const page = async ({ params }: { params: { hobby_slug: string } }) => {
  const { hobby_slug: slug } = params;
  const hobby = await getHobbyBySlug({ slug });

  return (
    <div>
      <HobbyFormUpdate hobby={hobby} />
    </div>
  )
}

export default page
