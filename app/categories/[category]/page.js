
export default async function Page({params}) {
    console.log(params.category);
    return (
      <div>
       Category: {params.category}
      </div>
    );
}