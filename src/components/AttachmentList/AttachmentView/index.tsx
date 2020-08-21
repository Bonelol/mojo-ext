import React, { useState, useEffect, useRef, useMemo, HTMLProps } from 'react';
import { Props } from 'src/types';
import { Attachment } from '@store/ticket/types';
import { mojoEndpoint } from '@config/index';

import './index.scss';
import { Button } from 'antd';
import { FileOutlined, CheckCircleOutlined, CopyOutlined, EyeOutlined } from '@ant-design/icons';
import classNames from 'classnames';

export interface AttachmentViewProps extends Props {
  token: string;
  attachment: Attachment;
  checked?: boolean;
  onClick?: () => void;
  onView?: (url: string) => void;
}

const AttachmentView = (props: AttachmentViewProps) => {
  const { token, attachment, onView, checked, onClick } = props;
  const [url, setUrl] = useState('');
  const [previewable] = useState(attachment && attachment.content_type.includes('image'));
  const imgRef = useRef<HTMLImageElement>(null);
  const attachmentClassNames = classNames('attachment-view', {'checked': checked}, {'previewable': previewable });

  useEffect(() => {
    setUrl(`${mojoEndpoint()}/api/v2/attachments/${attachment.id}?access_key=${token}`);
  }, [attachment, token]);

  const select = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.log(event);
  };

  const copy = (event: React.MouseEvent<HTMLElement>) => {
    // if(imgRef && imgRef.current) {
    //     (imgRef.current as HTMLImageElement).select();
    //     document.execCommand('copy');
    // }
  };

  const view = () => {
    onView && onView(url);
  };

  const attachmentButtons = previewable
    ? [
        <Button key="check" shape="circle" icon={<CheckCircleOutlined />} onClick={onClick} />,
        <Button key="copy" shape="circle" icon={<CopyOutlined />} onClick={copy} />,
        <Button key="eye" shape="circle" icon={<EyeOutlined />} onClick={view} />
      ]
    : [
        <Button key="check" shape="circle" icon={<CheckCircleOutlined />}onClick={onClick} />,
        <Button key="copy" shape="circle" icon={<CopyOutlined />} onClick={copy} />
      ];

  const thumb = useMemo(() => {
    if (previewable) {
      return <img src={url} ref={imgRef}></img>;
    } else {
      return <FileOutlined />;
    }
  }, [attachment, previewable, url]);

  return (
    <div className={attachmentClassNames}>
      <div className="attachment-view-overlay">
        <div className="attachment-buttons">
          {attachmentButtons}
        </div>
        <div className="attachment-name">{attachment.filename}</div>
      </div>
      <div className="attachment-thumb">{thumb}</div>
    </div>
  );
};

export default AttachmentView;
