import ChannelClient from './ChannelClient';

const fetchChannelByName = async (channelName: string) => {
  const data = await (await fetch(`http://localhost:4000/channels/${channelName}`, { method: 'GET' })).json();
  console.log(data);
  return data;
};

// export async function generateStaticParams() {
//   const channels = await axios.get('/channels');
//   return channels.data.map((channel: ChannelType) => ({
//     name: channel.name,
//   }));
// }

export default async function Page({ params }) {
  const channel = await fetchChannelByName(params.name);
  return <ChannelClient channel={channel} />;
}
