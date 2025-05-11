import { useEffect, useState } from 'react';
import { CreditCard, Check, DollarSign, Coins } from 'lucide-react';
import { useCoinStore } from '../../stores/coinStore';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CoinPackage = ({ pkg, onSelect, isSelected }) => {
  return (
    <div 
      className={`card cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-2 border-primary shadow-md transform scale-105' 
          : 'hover:shadow-md hover:scale-[1.02]'
      }`}
      onClick={() => onSelect(pkg)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{pkg.name}</h3>
        {isSelected && (
          <span className="bg-primary text-white p-1 rounded-full">
            <Check className="w-4 h-4" />
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-center mb-3">
        <Coins className="w-12 h-12 text-amber-400 mr-2" />
        <span className="text-3xl font-bold">{pkg.amount}</span>
      </div>
      
      <div className="text-center bg-gray-50 py-2 rounded-md mb-4">
        <span className="text-xl font-semibold">
          {pkg.price} {pkg.currency}
        </span>
      </div>
      
      <button 
        className={`w-full ${isSelected ? 'btn-primary' : 'btn-outline'}`}
      >
        {isSelected ? 'Selected' : 'Select Package'}
      </button>
    </div>
  );
};

const PurchaseCoinsPage = () => {
  const { packages, fetchPackages, purchaseCoins, loading } = useCoinStore();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();
  
  const stripe = useStripe();
  const elements = useElements();
  
  // Update page title
  useEffect(() => {
    document.title = 'Purchase Coins - VideoChat';
  }, []);
  
  // Fetch coin packages on component mount
  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);
  
  // Select a package
  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
  };
  
  // Process payment
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedPackage) {
      alert('Please select a coin package');
      return;
    }
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      if (paymentMethod === 'stripe') {
        const cardElement = elements.getElement(CardElement);
        
        if (!cardElement) {
          throw new Error('Card element not found');
        }
        
        const { error, paymentMethod: stripeMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Process purchase with API
        await purchaseCoins(
          selectedPackage.id, 
          'stripe', 
          { paymentMethodId: stripeMethod.id }
        );
        
        // Navigate to profile page on success
        navigate('/profile');
      } else if (paymentMethod === 'iyzico') {
        // Implement Iyzico payment flow if needed
        alert('Iyzico payment is not implemented in this demo');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error.message}`);
    } finally {
      setProcessingPayment(false);
    }
  };
  
  // Sample coin packages if none loaded yet
  const samplePackages = [
    { id: '1', name: 'Starter', amount: 100, price: 4.99, currency: 'USD' },
    { id: '2', name: 'Popular', amount: 500, price: 19.99, currency: 'USD' },
    { id: '3', name: 'Premium', amount: 1000, price: 34.99, currency: 'USD' },
  ];
  
  const displayPackages = packages.length > 0 ? packages : samplePackages;
  
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Purchase Coins</h1>
          <p className="text-gray-600 mb-8">
            Choose a coin package to enhance your VideoChat experience
          </p>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {displayPackages.map((pkg) => (
                <CoinPackage 
                  key={pkg.id}
                  pkg={pkg}
                  onSelect={handleSelectPackage}
                  isSelected={selectedPackage && selectedPackage.id === pkg.id}
                />
              ))}
            </div>
          )}
          
          {selectedPackage && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <button 
                  className={`flex-1 btn ${paymentMethod === 'stripe' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setPaymentMethod('stripe')}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Credit Card (Stripe)
                </button>
                <button 
                  className={`flex-1 btn ${paymentMethod === 'iyzico' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setPaymentMethod('iyzico')}
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Iyzico
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="card">
                <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
                
                {paymentMethod === 'stripe' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Information
                    </label>
                    <div className="border border-gray-300 rounded-md p-4 bg-white">
                      <CardElement 
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#424770',
                              '::placeholder': {
                                color: '#aab7c4',
                              },
                            },
                            invalid: {
                              color: '#9e2146',
                            },
                          },
                        }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Test card: 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3 digits
                    </p>
                  </div>
                )}
                
                {paymentMethod === 'iyzico' && (
                  <div className="mb-6 text-center py-4 text-gray-500">
                    <p>Iyzico integration would appear here in a production environment.</p>
                    <p className="mt-2 text-sm">This is a demo implementation.</p>
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Package:</span>
                    <span>{selectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">Coins:</span>
                    <span>{selectedPackage.amount} coins</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">Price:</span>
                    <span className="text-xl font-bold">
                      {selectedPackage.price} {selectedPackage.currency}
                    </span>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={!stripe || processingPayment}
                  className={`btn-primary py-3 w-full flex items-center justify-center ${
                    (!stripe || processingPayment) ? 'opacity-70' : ''
                  }`}
                >
                  {processingPayment ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Coins className="w-5 h-5 mr-2" />
                      Complete Purchase
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
          
          <div className="mt-12 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Why Purchase Coins?</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-primary mt-1 mr-2 flex-shrink-0" />
                <span>Start video chats with users around the world (5 coins per match)</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-primary mt-1 mr-2 flex-shrink-0" />
                <span>Unlock additional features and premium content</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-primary mt-1 mr-2 flex-shrink-0" />
                <span>Support our platform to build more exciting features</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-primary mt-1 mr-2 flex-shrink-0" />
                <span>Higher coin packages offer better value for money</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCoinsPage;