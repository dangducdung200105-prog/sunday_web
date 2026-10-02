import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getCourtById } from "../../services/courtService";
import { getCourtAvailability } from "../../services/availabilityService";
import { createBooking } from "../../services/bookingService";
import { createPayment } from "../../services/paymentService";

import { useAuth } from "../../context/AuthContext";

import CourtInfo from "../../components/court/CourtInfo";
import DatePicker from "../../components/booking/DatePicker";
import SlotGrid from "../../components/booking/SlotGrid";
import BookingSummary from "../../components/booking/BookingSummary";

const CourtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const [court, setCourt] = useState(null);
  const [slots, setSlots] = useState([]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [error, setError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // =========================
  // GET COURT
  // =========================

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const result = await getCourtById(id);

        setCourt(result.data.court);
      } catch (error) {
        console.error(error);

        setError("Không thể tải thông tin sân");
      } finally {
        setLoading(false);
      }
    };

    fetchCourt();
  }, [id]);

  // =========================
  // GET AVAILABILITY
  // =========================

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoadingSlots(true);

        const result = await getCourtAvailability(id, selectedDate);

        setSlots(result.data.slots);
      } catch (error) {
        console.error(error);

        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [id, selectedDate]);

  // =========================
  // SELECT DATE
  // =========================

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setBookingError("");
  };

  // =========================
  // SELECT SLOT
  // =========================

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setBookingError("");
  };

  // =========================
  // BOOKING
  // =========================

  const handleBooking = async () => {
    if (!selectedSlot) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");

      const result = await createBooking({
        courtId: court._id,
        bookingDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });

      const booking = result.data.booking;

      const paymentResult = await createPayment({
        bookingId: booking._id,
        method: "VNPAY",
      });

      window.location.href = paymentResult.data.paymentUrl;
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("ERROR:", error);

      setBookingError(
        error.response?.data?.message || "Không thể thực hiện thanh toán",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return <p>Đang tải thông tin sân...</p>;
  }

  // =========================
  // ERROR
  // =========================

  if (error || !court) {
    return <p>{error || "Không tìm thấy sân"}</p>;
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="court-detail-page">
      {/* IMAGE */}

      <div className="court-detail-image">
        {court.images?.length > 0 ? (
          <img src={court.images[0]} alt={court.name} />
        ) : (
          <div>SUNDAY</div>
        )}
      </div>

      {/* COURT INFO */}

      <CourtInfo court={court} />

      {/* BOOKING */}

      <div className="booking-section">
        <DatePicker selectedDate={selectedDate} onChange={handleDateChange} />

        <SlotGrid
          slots={slots}
          selectedSlot={selectedSlot}
          onSelect={handleSlotSelect}
          loading={loadingSlots}
        />

        <BookingSummary
          court={court}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          bookingError={bookingError}
          bookingLoading={bookingLoading}
          onConfirm={handleBooking}
        />
      </div>
    </div>
  );
};

export default CourtDetail;
