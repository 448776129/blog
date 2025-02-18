import { useState, Fragment, useEffect } from "react";
import axios from "axios";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Table, Popover, Tag, Avatar, Badge, Modal, Button, Tooltip, message } from "antd";
import { Link } from "react-router-dom";
import KingIcon from "@/assets/king.svg";
import { atom, useRecoilValue, useRecoilState } from "recoil";
import { articleListDataContext } from "./index";

export const tableOptionContext = atom({
  key: "table-option",
  default: {
    key: 0, //用于刷新表格
    page: !isNaN(+sessionStorage.page) ? +sessionStorage.page : 1,
    page_size: !isNaN(+sessionStorage.page_size) ? +sessionStorage.page_size : 10,
  },
});

const TableCom = () => {
  /** 文章列表数据 */
  let articleList = useRecoilValue(articleListDataContext);
  /** table的选择*/
  let [tableOption, setTableOption] = useRecoilState(tableOptionContext);

  const { confirm } = Modal;
  const destroyAll = () => {
    Modal.destroyAll();
  };

  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      render: (text: any, item: any) => {
        return (
          <Popover content={text} trigger="hover">
            <div
              className="whitespace-nowrap text-ellipsis overflow-hidden"
              style={{ width: "120px" }}
            >
              <Link to={`/article/${item.id}`}>{text}</Link>
            </div>
          </Popover>
        );
      },
      width: 300,
    },
    {
      title: "发表者",
      dataIndex: "author_data",
      render: (author_data: any) => {
        return (
          <Link to={`/user/${author_data.id}`}>
            <Badge
              count={
                author_data.auth == 1 && (
                  <div>
                    <img
                      src={KingIcon}
                      className="w-4 h-4"
                      style={{ transform: "rotate(45deg)" }}
                    />
                  </div>
                )
              }
            >
              <Avatar src={author_data.icon_url} style={{ verticalAlign: "middle" }} size="large">
                {(author_data.name as string).substring(0, 1).toLocaleUpperCase()}
              </Avatar>
            </Badge>
            <div>{author_data.name}</div>
          </Link>
        );
      },
      width: 180,
    },
    {
      title: "阅读量",
      dataIndex: "view_count",
      render: (view_count: any) => {
        return (
          <>
            <Tooltip title={view_count}>
              {view_count < 1000
                ? view_count
                : view_count > 1000000
                ? `${Math.ceil(view_count / 1000000)}M`
                : `${Math.ceil(view_count / 1000)}K`}
            </Tooltip>
          </>
        );
      },
      width: 100,
    },

    {
      title: "标签",
      dataIndex: "tag",
      render: (tags: any, record: any, index: any) => {
        return (
          <>
            {tags.map((item: any) => {
              return (
                <Tag
                  key={`article-list-${item.id}`}
                  className="mt-1"
                  icon={
                    item?.icon_url && (
                      <img className="w-5 h-5 mr-1" src={item.icon_url} alt="ICON" />
                    )
                  }
                  color="#55acee"
                >
                  {item?.name}
                </Tag>
              );
            })}
          </>
        );
      },
      width: "20%",
    },
    {
      title: "简介",
      dataIndex: "description",
      className: "break-all",
      render: (text: any) => {
        return (
          <Popover content={text} trigger="hover" overlayClassName="w-3/12 max-w-[300px] break-all">
            <div>{text}</div>
          </Popover>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "id",
      render: (id: any, item: any) => {
        return (
          <div className="flex justify-between">
            <Link to={`/article/${id}`}>
              <Button type="primary">编辑</Button>
            </Link>
            <Button
              type="primary"
              danger
              onClick={() => {
                confirm({
                  icon: <ExclamationCircleOutlined />,
                  maskClosable: true,
                  content: (
                    <div className="break-all">
                      确定删除作者:<b>{item.author_data.name}</b>的文章:<b>{item.title}</b>
                    </div>
                  ),
                  onOk() {
                    axios.delete(`/article/${id}`).then(res => {
                      if (res.data.success) {
                        message.success(res.data.message);
                        setTableOption(option => ({ ...option, key: option.key++ }));
                      } else {
                        message.error(res.data.message);
                      }
                    });
                  },
                  onCancel() {
                    destroyAll();
                  },
                });
              }}
            >
              删除
            </Button>
          </div>
        );
      },
      width: 200,
    },
  ];
  return (
    <>
      <Table
        rowKey="id"
        dataSource={articleList.list}
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
          total: articleList.total_count,
          current: tableOption.page,
          pageSize: tableOption.page_size,
          onChange: (page, pageSize) => {
            sessionStorage.page = page;
            sessionStorage.page_size = pageSize;
            setTableOption({ page: page, page_size: pageSize, key: 0 });
          },
          showSizeChanger: true,
          showQuickJumper: true,
          // hideOnSinglePage: true, //不要随便开，如果page_size调大了分页隐藏 调不回来
        }}
      />
    </>
  );
};
export default TableCom;
