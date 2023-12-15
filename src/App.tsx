import React, { useState } from 'react';

import { App, Input, Button, Layout, Space, Form, Divider, Table, Collapse } from 'antd';
import { Content } from 'antd/es/layout/layout';

import Client from './Client';

type Key = number|string|bigint

const FileList = ({ torrentInfo } : { torrentInfo: any|null }) => {
  const columns = [
    { title: 'File Name', dataIndex: 'name' },
    {
      title: 'File Size',
      dataIndex: 'size',
      sorter: {
        compare:(a: any, b: any) => b.size - a.size,
        multiple: 2,
      }
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<Key>>([]);


  const rowSelections = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ]
  }

  const [videoSource, setVideoSource] = useState<string|undefined>();
  const [activeKey, setActiveKey] = useState<string>('1');
  const onCollapseChange = (v: any) => {
    setActiveKey(v)
  }
  const playSelected = () => {
    console.log(selectedRowKeys);
    console.log(torrentInfo);

    let videoName = selectedRowKeys.find((f) => f.toString().endsWith(".mp4"))

    if (!videoName) {
      console.log("video file not found");
      setVideoSource(undefined);
      return
    }

    let videoFile = torrentInfo.files.find((f: any) => f.name === videoName);
    console.log(videoFile);
    torrentInfo.resume();

    setActiveKey('');
    console.log("Stsrting streaming", videoFile.streamURL);
    setVideoSource(videoFile.streamURL);
  }

  if (torrentInfo && torrentInfo.files) {
    const files = torrentInfo.files.map((f: any) => { return { name: f.name, size: f.size, key: f.name } });
    return (
      <>
        <Collapse bordered={false} ghost={true} activeKey={activeKey} defaultActiveKey={['1']} size='large'
        onChange={onCollapseChange}
          items={[
          {
            key: '1',
            label: 'Table',
            children: <>
              <Table size='small' rowSelection={rowSelections} columns={columns} dataSource={files} pagination={{ pageSize: 15 }} />
              <Button type="primary" onClick={playSelected}>Select</Button>
            </>
          }
        ]}>
        </Collapse>
        <video crossOrigin='anonymous' id="player" controls={true} hidden={!videoSource} src={videoSource} autoPlay={true}>
          {
            selectedRowKeys.filter((x) => x.toString().endsWith('.srt'))
              .map((x) =>
                <track label="English" kind="subtitles" srcLang='en' key={x} src={ torrentInfo.files.find((f: any) => f.name === x)?.streamURL } />
              )
          }
        </video>
      </>
    );
  } else {
    return (<></>);
  }
};

const MyPage: React.FC = () => {
  const [magnetLink, setMagnetLink] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMagnetLink(event.target.value);
  };

  const [torrentInfo, setTorrentInfo] = useState<any|null>(null);

  const handlePreview = () => {
    // Placeholder for preview functionality
    console.log("handlePreview", magnetLink);

    Client.add(magnetLink, {}, (torrent: any) => {
      setTorrentInfo(torrent);
    });
  };

  return (
    <Layout>
      <Content style={{ padding: '0 192px' }}>
        <h1>Magnet Link Preview</h1>
        <Form
          onFinish={handlePreview}
        >
          <Space.Compact block direction="horizontal">
            <Input
              type="text"
              autoFocus
              value={magnetLink}
              onChange={handleInputChange}
              placeholder="Paste your magnet link here"
            />
            <Button type="primary" htmlType="submit">Preview Content</Button>
          </Space.Compact>
        </Form>
        <Divider>
          HELP
        </Divider>
        <FileList torrentInfo={torrentInfo}></FileList>
      </Content>
    </Layout>
  );
};

const MyApp: React.FC = () => (
  <App>
    <MyPage />
  </App>
);

export default MyApp;
