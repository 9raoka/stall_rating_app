import React, { useState } from "react";

const ReviewForm = ({ shopId }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewData = {
      shopId: shopId,
      review: review,
      rating: rating,
    };

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`http://localhost:5000/shops/${shopId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        setSuccessMessage("レビューが投稿されました！");
        setReview("");
        setRating(0);
        setErrorMessage("");
      } else {
        setErrorMessage("レビューの投稿に失敗しました");
      }
    } catch (error) {
    
      setErrorMessage("エラーが発生しました。もう一度お試しください。"+error);
    }
  };

  return (
    <div>
      <h3>レビューを投稿する</h3>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>レビュー:</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>評価:</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="0"
            max="5"
            required
          />
        </div>
        <button type="submit">投稿</button>
      </form>
    </div>
  );
};

export default ReviewForm;
