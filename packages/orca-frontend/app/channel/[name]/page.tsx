import axios from 'axios';
import ChannelClient from './ChannelClient';

const fetchChannelByName = async (channelName: string) => {
  const { data } = await axios.get(`http://localhost:4000/channels/${channelName}`);
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
