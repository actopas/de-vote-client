/*
 * @Describle:
 * @Author: sunmingyuan <fishmooger@gmail.com>
 * @Date: 2024-08-09 02:01:54
 * @LastEditors: sunmingyuan
 * @LastEditTime: 2024-08-10 23:15:41
 */
import React, { useState, useEffect } from "react";
import { Button, Card, Row, Col, List, Avatar, Dropdown } from "antd";
import Web3 from "web3";
const contractAddress = "0x90B87487248DD14a98A83407D982c57A50BFde1F";
const Home = () => {
  const voteList = [
    { name: "Alice", id: "1", desc: "Lorem ipsum dolor sit amet." },
    { name: "Bob", id: "2", desc: "Consectetur adipiscing elit." },
    { name: "Charlie", id: "3", desc: "Integer nec odio. Praesent libero." },
    { name: "David", id: "4", desc: "Sed cursus ante dapibus diam." },
    {
      name: "Eva",
      id: "5",
      desc: "Nulla quis sem at nibh elementum imperdiet.",
    },
    { name: "Frank", id: "6", desc: "Duis sagittis ipsum. Praesent mauris." },
    {
      name: "Grace",
      id: "7",
      desc: "Fusce nec tellus sed augue semper porta.",
    },
    {
      name: "Hank",
      id: "8",
      desc: "Mauris massa. Vestibulum lacinia arcu eget nulla.",
    },
    {
      name: "Ivy",
      id: "9",
      desc: "Class aptent taciti sociosqu ad litora torquent.",
    },
    {
      name: "Jack",
      id: "10",
      desc: "Suspendisse in justo eu magna luctus suscipit.",
    },
    { name: "Kathy", id: "11", desc: "Curabitur sodales ligula in libero." },
    { name: "Leo", id: "12", desc: "Sed dignissim lacinia nunc." },
    { name: "Mona", id: "13", desc: "Curabitur tortor. Pellentesque nibh." },
    {
      name: "Nina",
      id: "14",
      desc: "Aenean quam. In scelerisque sem at dolor.",
    },
    {
      name: "Oscar",
      id: "15",
      desc: "Maecenas mattis. Sed convallis tristique sem.",
    },
    {
      name: "Paul",
      id: "16",
      desc: "Proin ut ligula vel nunc egestas porttitor.",
    },
    {
      name: "Quincy",
      id: "17",
      desc: "Morbi lectus risus, iaculis vel, suscipit quis.",
    },
    {
      name: "Rachel",
      id: "18",
      desc: "Mauris ipsum. Nulla metus metus, ullamcorper vel.",
    },
    { name: "Steve", id: "19", desc: "Vivamus quis mi. Phasellus a est." },
    {
      name: "Tina",
      id: "20",
      desc: "Phasellus magna. In hac habitasse platea dictumst.",
    },
  ];

  const [account, setAccount] = useState("");
  const [abi, setAbi] = useState([]);
  const [rankList, setRankList] = useState([]);
  const [contract, setContract] = useState(null);
  const web3 = new Web3(window.ethereum);

  const linkMetaMask = async () => {
    // 检查 MetaMask 是否已安装
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        // 请求用户连接 MetaMask
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error("User denied account access");
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
    const accounts = await window.web3.eth.getAccounts();
    setAccount(accounts[0]);
    console.log("User's account:", accounts[0]);
  };
  const getVote = async (id) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const receipt = await contract.methods
        .vote(id)
        .send({ from: accounts[0] });
      console.log(receipt);
      getVoteList();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const getVoteList = async () => {
    if (contract) {
      try {
        console.log(contract.methods, abi);
        const tempVoteList = await contract.methods.getVoteList().call();
        console.log("tempv", tempVoteList);
        const rankList = tempVoteList[0].map((id, index) => ({
          id: id.toString(), // 将 BigInt 转换为字符串
          name: voteList[id.toString() - 1].name,
          votes: tempVoteList[1][index].toString(), // 将对应的 votes 转换为字符串
        }));
        console.log(rankList, voteList);
        setRankList(rankList.sort((a, b) => b.votes - a.votes));
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("Contract not initialized");
    }
  };
  const shortenAddress = (address, length = 4) => {
    if (!address) return "";
    const start = address.substring(0, length + 2); // 加2是因为包括 "0x"
    const end = address.substring(address.length - length);
    return `${start}...${end}`;
  };
  const disconnectAccount = () => {
    setAccount("");
  };
  useEffect(() => {
    const fetchAbi = async () => {
      const response = await fetch("/Vote.json");
      console.log(response, "res");
      const data = await response.json();
      console.log(data.abi, "data");

      setAbi(data.abi);
      const web3 = new Web3(window.ethereum);
      const contractInstance = new web3.eth.Contract(data.abi, contractAddress);

      setContract(contractInstance);
      console.log(abi, "abi");
    };
    fetchAbi();
  }, []);
  useEffect(() => {
    if (contract) {
      getVoteList();
    }
  }, [contract]);
  return (
    <div className="h-screen flex flex-col font-mono">
      <div className="w-screen h-14 flex justify-between items-center pl-4 pr-4">
        <div>Decentralized Voting Platform</div>
        {!account ? (
          <Button className="" onClick={linkMetaMask}>
            Connect Wallet
          </Button>
        ) : (
          <div>
            <span>Connect as </span>
            <Dropdown
              overlay={<Button onClick={disconnectAccount}>Disconnect</Button>}
              placement="bottom"
              arrow
            >
              <Button>{shortenAddress(account)}</Button>
            </Dropdown>
          </div>
        )}
      </div>
      <div className="flex h-5/6">
        <div className="bg-gray-100 w-3/4 overflow-y-auto overflow-x-hidden">
          <Row gutter={16}>
            {voteList.map((item) => {
              return (
                <Col span={6}>
                  <Card
                    className="m-4"
                    bordered={false}
                    style={{ width: 250 }}
                    title={
                      <>
                        <Avatar
                          className="-mt-1"
                          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item.id}`}
                        />
                        <span className="inline-block">{item.name}</span>
                      </>
                    }
                    extra={
                      <Button
                        onClick={() => {
                          getVote(item.id);
                        }}
                      >
                        Vote
                      </Button>
                    }
                  >
                    <p>{item.desc}</p>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
        <div className="w-1/4 overflow-y-auto">
          <div className=" h-12 p-4 absolute bg-white z-10">Live Ranking</div>
          <div className="p-4 overflow-y-auto pt-12">
            <List
              itemLayout="horizontal"
              dataSource={rankList}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        className="-mt-2"
                        src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item.id}`}
                      />
                    }
                    title={item.name}
                    description=""
                  />
                  <div>{item.votes}</div>
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center flex-1 italic">
        © 2024 Decentralized Voting Platform. Licensed under the MIT License. /
        Built with React, Solidity, Truffle, and Web3.js.
      </div>
    </div>
  );
};

export default Home;
