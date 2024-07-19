import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import useSWR from "swr";
import { Order } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
import { IconAlertTriangleFilled, IconPlus, IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";

export default function StaffPage() {
  const { data: orders, error } = useSWR<Order[]>("/staffs");
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async (orderId) => {
    try {
        setIsProcessing(true);
        await axios.delete(`/staffs/${orderId}`);
        notifications.show({
            title: "ลบรายการสำเร็จ",
            message: "ลบรายการนี้ออกจากระบบเรียบร้อยแล้ว",
            color: "green",
        });
        navigate("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลรายการ",
            message: "ไม่พบข้อมูลรายการที่ต้องการลบ",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Layout>
        <section
          className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
          style={{
            backgroundImage: `url(${cafeBackgroundImage})`,
          }}
        >
          <h1 className="text-5xl mb-2">รายการออเดอร์</h1>
          <h2>รายการที่สั่งอาหารมาทั้งหมด</h2>
        </section>

        <section className="container mx-auto py-8">
          {!orders && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {orders?.map((order) => (
              <div className="border border-solid border-neutral-200" key={order.id}>
                <div className="p-4">
                  <h2 className="text-lg font-semibold line-clamp-2">{order.name}</h2>
                    <p className="text-xs text-neutral-500">จำนวน {order.total} ชิ้น</p>
                  <p className="text-xs text-neutral-500">ราคาทั้งหมด {order.price} บาท</p>
                </div>
                <div className="flex justify-end px-4 pb-2">
                <div className="flex justify-between">
                <Button
                    color="red"
                    leftSection={<IconTrash />}
                    size="xs"
                    onClick={() => {
                      modals.openConfirmModal({
                        title: "คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่",
                        children: (
                          <span className="text-xs">
                            เมื่อคุณดำนเนินการลบเมนูนี้แล้ว จะไม่สามารถย้อนกลับได้
                          </span>
                        ),
                        labels: { confirm: "ลบ", cancel: "ยกเลิก" },
                        onConfirm: () => {
                          handleDelete(order.id);
                        },
                        confirmProps: {
                          color: "red",
                        },
                      });
                    }}
                    >
                    ลบเมนูนี้
                  </Button>
                </div>
              </div>
            </div>
            ))}
          </div>
        </section>
      </Layout>
    </>
  );
}
